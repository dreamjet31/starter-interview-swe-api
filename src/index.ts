import express, { Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { addReading, getReading, Reading } from './database';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.post('/data', async (req, res) => {
  // TODO: parse incoming data, and save it to the database
  // data is of the form:
  //  {timestamp} {name} {value}

  // addReading(...)

  try {
    const lines = req.body.split('\n');
    lines.forEach((line: String) => {
      const parts = line.trim().split(' ');

      if (parts.length !== 3) throw new Error('Malformed data');

      const [timestampPart, name, valuePart] = parts;

      // Check if the timestamp is a valid number
      const timestamp = parseInt(timestampPart);
      if (isNaN(timestamp)) {
        throw new Error('Malformed data - invalid timestamp');
      }

      // Check if the name is either 'Voltage' or 'Current'
      if (!['Voltage', 'Current'].includes(name)) {
        throw new Error("Malformed data - name must be 'Voltage' or 'Current'");
      }

      // Check if the value is a valid number
      const value = parseFloat(valuePart);
      if (isNaN(value)) {
        throw new Error('Malformed data - value must be a number');
      }
    });

    lines.forEach((line: String) => {
      const parts = line.trim().split(' ');
      const [timestampPart, name, valuePart] = parts;
      const timestamp = parseInt(timestampPart);
      const value = parseFloat(valuePart);
      const reading: Reading = { timestamp, name, value };
      addReading(reading);
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
});

app.get('/data', async (req, res) => {
  // TODO: check what dates have been requested, and retrieve all data within the given range

  // getReading(...)

  try {
    const fromTimestamp = new Date(req.query.from as string).getTime() / 1000;
    const toTimestamp = new Date(req.query.to as string).getTime() / 1000;

    const readings = getReading(fromTimestamp, toTimestamp);
    return res.json(readings);
  } catch (error) {
    return res.status(400).json({ success: false });
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT} ⚡`));
