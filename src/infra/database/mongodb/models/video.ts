import mongoose from 'mongoose';

import { mongoConnection } from '../index';

const status = ['Processando', 'Concluído'];

const Schema = new mongoose.Schema(
  {
    fileName: {
      required: true,
      type: String,
    },
    videoPath: {
      key: {
        type: String,
        required: true,
      },
      bucket: {
        type: String,
        required: true,
      },
    },
    imagesZipPath: {
      key: {
        type: String,
      },
      bucket: {
        type: String,
      },
    },
    status: {
      type: String,
      required: true,
      enum: status,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

Schema.index({ user: 1 });

export const VideoModel = mongoConnection.model('video', Schema);
