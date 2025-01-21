import mongoose from 'mongoose';

import { mongoConnection } from '../index';

const Schema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

Schema.index({ email: 1 }, { unique: true });

const DUPLICATE_KEY_CODE = 11000;

function duplicate(err: any, _doc: any, next: (err?: Error) => void): void {
  if (err.name === 'MongoServerError' && err.code === DUPLICATE_KEY_CODE) {
    next(new Error('User already exists'));
  }

  next();
}

Schema.post('save', duplicate);
Schema.post('findOneAndUpdate', duplicate);

export const UserModel = mongoConnection.model('user', Schema);
