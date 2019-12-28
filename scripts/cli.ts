import { prompt } from 'enquirer'
import { openStorage } from '../src/persistence'
import { plainToClass } from '@marcj/marshal'

import { Publishing } from '../src/models'

const storage = openStorage()

const toFields = (form: Publishing.Form) => 
  Object.keys(form.schema.properties).map(key => ({
    name: key,
    message: key,
    type: form.schema.properties[key] == 'number' ? 'numeral' : 'text'
  }))

;(async () => {
  let publicForms = await storage.forms.find({ 'slug': { $exists: true } })
  console.log(publicForms)

  let formPicked = await prompt<{form: string}>({
    name: 'form',
    type: 'select',
    message: 'Pick a form',
    choices: <string[]>publicForms.map((form: Publishing.Form) => form.slug)
  })

  console.log(`picked ${formPicked.form}`)

  let forms = (await storage.forms.find({ slug: formPicked.form }))

  if (forms.length === 0) {
    throw new Error(`couldn't find form ${formPicked}?`)
  }

  let form = forms[0]
  let again = true

  while (again) {
    let subData = (await prompt<{ submission: any }>({
	name: 'submission',
	type: 'form',
	message: formPicked.form,
	choices: toFields(form as Publishing.Form)
    })).submission

    let go = (await prompt<{ save: boolean }>({
      name: 'save',
      type: 'confirm',
      message: 'Save?'
    })).save

    if (go) {
      let submission = await form.submit(process.env.USER || 'unknown client', subData)
      await storage.submissions.save(submission)
      console.log(`saved submission ${submission._id}`)
    }

    again = (await prompt<{ again: boolean }>({
      name: 'again',
      type: 'confirm',
      message: 'Another?'
    })).again
  }
})()
