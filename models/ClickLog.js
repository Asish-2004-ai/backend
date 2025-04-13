import mongoose from 'mongoose';

const clickLogSchema = new mongoose.Schema({
  alias: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  deviceType: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ClickLog = mongoose.model('ClickLog', clickLogSchema);


export default ClickLog;
