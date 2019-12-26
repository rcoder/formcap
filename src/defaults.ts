import { Publishing } from './models'

export const SignupSchema = Object.freeze({
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string', maxLength: 32 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6, maxLength: 32 }
  }
})

export const SignupForm = new Publishing.Form()

SignupForm.limits = {
  rate: {
    // 100 signups per day
    count: 100,
    interval: Publishing.Interval.DAY,
  },
  // and only one per client (need to make this not trivial to circumvent or trip accidentally)
  perClient: 1
}

SignupForm.schema = SignupSchema
SignupForm.publish('sign-up', Publishing.Visibility.PUBLIC)
Object.freeze(SignupForm)

export const ContactSchema = Object.freeze({
  type: 'object',
  required: ['replyTo', 'message'],
  properties: {
    replyTo: { type: 'string', maxLength: 100 },
    message: { type: 'string', maxLength: 1000 }
  }
})

export const ContactForm = new Publishing.Form()

ContactForm.limits = {
  rate: {
    // 100 contact requests per hour
    count: 100,
    interval: Publishing.Interval.HOUR
  }
}

ContactForm.schema = ContactSchema
ContactForm.publish('contact', Publishing.Visibility.PUBLIC)
Object.freeze(ContactForm)
