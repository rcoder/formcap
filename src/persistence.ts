import Datastore from 'nedb-promises'

import { Publishing } from './models'

import { plainToClass, classToPlain } from '@marcj/marshal'

abstract class TypedStore<T extends { _id: string }> {
  constructor(readonly db: Datastore) { }

  marshalClass: any

  async load(id: string): Promise<T> {
    let doc = await this.db.findOne({ _id: id })
    return plainToClass(this.marshalClass, doc)
  }

  async save(obj: T): Promise<any> {
    let doc = classToPlain(this.marshalClass, obj)
    await this.db.update({ _id: doc._id }, doc, { upsert: true })
    return doc
  }

  async find(filter: any): Promise<any> {
    let cursor = await this.db.find(filter).exec()
    return cursor
  }
}

export class FormStore extends TypedStore<Publishing.Form> {
  marshalClass = Publishing.Form
}

export class SubmissionStore extends TypedStore<Publishing.Submission> {
  marshalClass = Publishing.Submission
}

export interface StorageContext {
  forms: FormStore,
  submissions: SubmissionStore
}

const openDb = (name: string, baseDir: string='.') => Datastore.create({
  filename: `${baseDir}/${name}.db`
})

export function openStorage(baseDir?: string): StorageContext {
  let forms = new FormStore(openDb('forms', baseDir))
  let submissions = new SubmissionStore(openDb('subs', baseDir))
  return { forms, submissions }
}
