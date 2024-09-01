import { connect } from 'mongoose';
// Connect to Mongo
const connectDB = async () => {
  try {
    const con = await connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
export default connectDB;
