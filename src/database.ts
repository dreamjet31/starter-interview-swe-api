export interface Reading {
  // TODO: change this to contain whatever information is needed
  timestamp: number;
  name: string;
  value: number;
}

export type ReadingByTimestamp = Record<number, Array<Reading>>;

// This is a fake database which stores data in-memory while the process is running
// Feel free to change the data structure to anything else you would like
const database: ReadingByTimestamp = {};

/**
 * Store a reading in the database using the given key
 */
export const addReading = (reading: Reading): void => {
  if (!database[reading.timestamp]) {
    database[reading.timestamp] = [];
  }
  database[reading.timestamp].push(reading);
  console.log(database);
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReading = (from: number, to: number): Reading[] => {
  const result: Reading[] = [];

  Object.keys(database)
    .filter((key) => parseInt(key) >= from && parseInt(key) <= to)
    .map((key) => {
      database[parseInt(key)].map((item) => result.push(item));
      result.push({
        timestamp: parseInt(key),
        name: 'Power',
        value: Number(
          database[parseInt(key)]
            .map((item) => item.value)
            .reduce((a, b) => a * b)
            .toFixed(2)
        ),
      });
    });

  return result;
};
