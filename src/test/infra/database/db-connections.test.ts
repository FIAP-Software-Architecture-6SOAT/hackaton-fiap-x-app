/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/unbound-method */
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import type { Model as ModelType } from 'mongoose';

import { MongoDbConnection } from '@/infra/database/mongodb/db-connections/db-connections';

describe('MongoDbConnection', () => {
  let modelMock: MockProxy<ModelType<unknown>>;
  let mongoDbConnection: MongoDbConnection;

  beforeEach(() => {
    modelMock = mock<ModelType<unknown>>();
    mongoDbConnection = new MongoDbConnection(modelMock as unknown as ModelType<unknown>);
    jest.clearAllMocks();
  });

  describe('edit', () => {
    it('should update a document and return the updated document', async () => {
      const params = { id: '123', value: { status: 'In preparation' } };
      const updatedModel = { _id: '123', ...params.value };
      modelMock.findByIdAndUpdate.mockResolvedValue(updatedModel);

      const result = await mongoDbConnection.edit(params);

      expect(modelMock.findByIdAndUpdate).toHaveBeenCalledWith('123', params.value, { new: true });
      expect(result).toEqual(updatedModel);
    });
  });

  describe('find', () => {
    it('should find documents based on params and return them', async () => {
      const params = { id: '123' };
      const foundModels = [{ _id: '123', status: 'In preparation' }];
      modelMock.find.mockResolvedValue(foundModels);

      const result = await mongoDbConnection.find(params);

      expect(modelMock.find).toHaveBeenCalledWith(params);
      expect(result).toEqual(foundModels);
    });
  });

  describe('findOne', () => {
    it('should find a single document based on params and return it', async () => {
      const params = { _id: '123' };
      const foundModel = { _id: '123', status: 'In preparation' };
      modelMock.findOne.mockResolvedValue(foundModel);

      const result = await mongoDbConnection.findOne(params);

      expect(modelMock.findOne).toHaveBeenCalledWith(params);
      expect(result).toEqual(foundModel);
    });
  });

  describe('delete', () => {
    it('should delete a document by ID', async () => {
      const id = '123';
      modelMock.findByIdAndDelete.mockResolvedValue(undefined);

      await mongoDbConnection.delete(id);

      expect(modelMock.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
