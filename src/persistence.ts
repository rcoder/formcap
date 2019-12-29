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

  async find(filter: any): Promise<T[]> {
    let cursor = await this.db.find(filter).exec()
    return cursor.map(doc => plainToClass(this.marshalClass, doc))
  }
}

export class FormStore extends TypedStore<Publishing.Form> {
  marshalClass = Publishing.Form
}

export class SubmissionStore extends TypedStore<Publishing.Submission> {
  marshalClass = Publishing.Submission
}

export class ResponseStore extends TypedStore<Publishing.Response> {
  marshalClass = Publishing.Response
}

export interface StorageContext {
  forms: FormStore,
  submissions: SubmissionStore,
  responses: ResponseStore
}

const openDb = (name: string, baseDir: string='.') => Datastore.create({
  filename: `${baseDir}/${name}.db`
})

export const openStorage = (baseDir?: string) => ({
  forms: new FormStore(openDb('forms', baseDir)),
  submissions: new SubmissionStore(openDb('subs', baseDir)),
  responses: new ResponseStore(openDb('resps', baseDir))
})
