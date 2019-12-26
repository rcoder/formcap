import { f, uuid } from '@marcj/marshal'
import { produce } from 'immer'
import Ajv from 'ajv'

export namespace Publishing {
  export enum Visibility {
    DRAFT = 0,
    PRIVATE = 1,

    PUBLIC = 2,
    DELETED = -1
  }

  class Artifact {
    @f.primary().uuid()
    id: string = uuid()

    @f.enum(Visibility)
    visibility: Visibility = Visibility.DRAFT

    @f publishedAt?: Date

    @f slug?: string

    @f ownerId?: string

    publish(slug?: string, visibility: Visibility = Visibility.PRIVATE): this {
      return produce(this, draft => {
	if (visibility === Visibility.PUBLIC) {
	  draft.publishedAt = new Date()
	}
	if (slug) {
	  draft.slug = slug
	}
	draft.visibility = visibility
      })
    }

    delete(): this {
      return produce(this, draft => {
	draft.visibility = Visibility.DELETED
      })
    }
  }

  export class Page extends Artifact {
    @f content: string

    constructor(content: string) {
      super()
      this.content = content
    }
  }

  export enum Interval {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR
  }

  export class Limits {
    total?: number
    rate?: { interval: Interval, count: number }
    perClient?: number
  }

  export class Form extends Artifact {
    @f.enum(Visibility)
    visibility: Visibility = Visibility.DRAFT

    @f.type(Limits)
    limits?: Limits

    @f.any()
    schema?: any

    get strictSchema() {
      return { additionalProperties: false, ...this.schema }
    }

    async submit(clientId: string, values: any): Promise<Submission> {
      // TODO: enforce + maintain limits
      let submission = new Submission(this.id, clientId)
      submission.values = values

      if (this.schema) {
	let validate = new Ajv().compile(this.strictSchema)
	let filtered = validate(values)
	let validation = new Validation()
	submission.validation = validation

	if (filtered) {
	  validation.passed = true
	  validation.validated = filtered
	} else {
	  validation.errors = validate.errors
	}
      }

      return submission
    }
  }

  export class Validation {
    @f passed: boolean = false

    @f.any()
    errors?: any[] | null

    @f validatedAt: Date = new Date()

    @f.any()
    validated?: any
  }

  export class Submission {
    @f.primary().uuid()
    id: string = uuid()

    @f.uuid()
    formId: string

    @f.uuid()
    clientId: string

    @f.any()
    values: any

    @f.type(Validation)
    validation?: Validation

    constructor(formId: string, clientId: string, values?: any) {
      this.formId = formId
      this.clientId = clientId
      this.values = values
    }
  }
}
