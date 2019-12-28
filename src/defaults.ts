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

ContactForm.schema = ContactSchema
ContactForm.publish('contact', Publishing.Visibility.PUBLIC)
Object.freeze(ContactForm)

export const CommentSchema = Object.freeze({
  type: 'object',
  required: ['username', 'message'],
  properties: {
    username: { type: 'string', maxLength: 32 },
    message: { type: 'string', maxLength: 1000 },
    ref: { type: 'string', maxLength: 1000 }
  }
})

export const CommentForm = new Publishing.Form()

CommentForm.schema = CommentSchema
CommentForm.publish('comment', Publishing.Visibility.PUBLIC)
Object.freeze(CommentForm)

