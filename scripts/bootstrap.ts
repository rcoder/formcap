import { openStorage } from '../src/persistence'
import { SignupForm, ContactForm, CommentForm } from '../src/defaults'

(async () => {
  const storage = openStorage()

  let signup = await storage.forms.save(SignupForm)
  console.log(`signup form registered: ${signup._id}`)

  let contact = await storage.forms.save(ContactForm)
  console.log(`contact form registered: ${contact._id}`)

  let comment = await storage.forms.save(CommentForm)
  console.log(`comment form registered: ${comment._id}`)
})()
