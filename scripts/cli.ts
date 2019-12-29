import { prompt } from 'enquirer'
import { openStorage } from '../src/persistence'
import { plainToClass } from '@marcj/marshal'

import { Publishing } from '../src/models'

const storage = openStorage()

const toFields = (schema: { properties: any }) => 
  Object.keys(schema.properties).map(key => ({
    name: key,
    message: key,
    type: schema.properties[key] == 'number' ? 'numeral' : 'text'
  }))

const confirm = async (msg: string) => 
  (await prompt<{ go: boolean }>({
    name: 'go',
    type: 'confirm',
    message: msg,
  })).go

;(async () => {
  let publicForms = await storage.forms.find({ 'slug': { $exists: true } })
  console.log(publicForms)

  let formPicked = (await prompt<{form: string}>({
    name: 'form',
    type: 'select',
    message: 'Pick a form',
    choices: <string[]>publicForms.map((form: Publishing.Form) => form.slug)
  })).form

  console.log(`picked ${formPicked}`)

  let forms = (await storage.forms.find({ slug: formPicked }))

  if (forms.length === 0) {
    throw new Error(`couldn't find form ${formPicked}?`)
  }

  let form = forms[0]
  let again = true

  while (again) {
    let pForm = form as Publishing.Form

    let subData = (await prompt<{ submission: any }>({
	name: 'submission',
	type: 'form',
	message: formPicked,
	choices: toFields(pForm.schema)
    })).submission

    let go = await confirm('Save?')

    if (go) {
      let clientId = process.env.USER || 'unknown client'

      let submission = await form.submit(clientId, subData)
      await storage.submissions.save(submission)
      console.log(`saved submission ${submission._id}`)

      let respond = await confirm('Respond?')

      if (respond) {
	let respData = (await prompt<{ response: any }>({
	  name: 'response',
	  type: 'form',
	  message: `response to ${formPicked}`,
	  choices: toFields(pForm.responseSchema)
	})).response

	let saveResp = await confirm('Save?')

	if (saveResp) {
	  let response = new Publishing.Response(
	    submission._id,
	    submission.formId,
	    clientId,
	    respData
	  )
	  await storage.responses.save(response)
	}
      }
    }

    again = await confirm('Another?')
  }
})()
