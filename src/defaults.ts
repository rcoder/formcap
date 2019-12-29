import { Publishing } from './models'

export const SignupSchema = Object.freeze({
  type: 'object',
  required: ['username', 'email', 'invite'],
  properties: {
    username: { type: 'string', maxLength: 32 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' }
  }
})

export const InviteSchema = Object.freeze({
  type: 'object',
  required: [],
  properties: {
    limit: { type: 'number' }
  }
})

export const SignupForm = new Publishing.Form()

SignupForm.schema = SignupSchema
SignupForm.responseSchema = InviteSchema
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
ContactForm.responseSchema = ContactSchema
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
CommentForm.responseSchema = CommentSchema
CommentForm.publish('comment', Publishing.Visibility.PUBLIC)
Object.freeze(CommentForm)

