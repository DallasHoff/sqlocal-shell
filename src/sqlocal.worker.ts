/// <reference lib="webworker" />
import { SQLiteOpfsDriver, SQLocalProcessor } from 'sqlocal';

const driver = new SQLiteOpfsDriver();
const processor = new SQLocalProcessor(driver);

self.onmessage = (message) => {
  processor.postMessage(message);
};

processor.onmessage = (message, transfer) => {
  self.postMessage(message, transfer);
};
