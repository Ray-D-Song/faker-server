import { ObjectId } from 'mongodb'

declare global {
  interface Api {
    _id?: ObjectId
    name: string
    method: string
    path: string
    description?: string
    deleted?: boolean
    resStatus: number
    resHeaders?: Record<string, string>
    resResponseType: string
    resBody: any
    createdAt?: Date
    updatedAt?: Date
  }
}

export {}
