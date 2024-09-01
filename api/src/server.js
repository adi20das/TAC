import express from 'express';
const app = express();
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import packageInfo from '../package.json' assert { type: 'json' };
import connectDB from './connection.js';
import CalendarEvent from './model/calendarEvent.js';
import UserModel from './model/userModel.js';
import PasswordResetToken from './model/passwordResetToken.js';
import { sendResetConfirmMail, sendResetMail } from './nodemailer.js';
import { getFormattedMonth, getLastDate } from './util/date-utils.js';
import { buildFilterQuery } from './util/nytimes-api-utils.js';
import UserPreference from './model/userPreference.js';
import SavedList from './model/SavedList.js';
import HistoricalEvent from './model/historicalEvents.js';

dotenv.config();
const PORT = process.env.PORT || 8080;
const ARTICLE_API_URL = process.env.ARTICLE_API_URL;
const API_KEY = process.env.API_KEY;
const MIN_YEAR = 1852;
// TODO - consider enums
const VALID_SAVED_LIST_ACTIONS = ['removeEvent', 'addEvent'];

// log request
app.use(morgan('tiny'));

// CORS middleware for cross origin requests
app.use(cors());

app.use(express.json());

// Health check route
app.get('/', (req, res, next) => {
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  // Prevent this response from being cached
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json({
    status: 'ok',
    githubURL: 'https://github.com/Eakam1007/TAC',
    version: packageInfo.version,
  });
});

app.get('/calendar-events', async (req, res, next) => {
  const userId = req.query.userId;
  const user = UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'user does not exist' });
  }

  try {
    const calendarEvents = await CalendarEvent.find({ userId });
    const events = calendarEvents.map((event) => {
      return {
        id: event._id,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        allDay: event.allDay,
      };
    });

    res.status(200).json({ events });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Error while fetching calendar events for user' });
  }
});

app.get('/calendar-events/upcoming', async (req, res, next) => {
  const userId = req.query.userId;
  const currentTime = new Date();
  let checkTime = new Date();
  checkTime.setSeconds(checkTime.getSeconds() + 61);
  try {
    const upcomingEvents = await CalendarEvent.find({
      userId,
      reminderTime: { $gt: currentTime, $lt: checkTime },
    });
    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ status: 'error', message: 'Error while getting upcoming calendar events' });
  }
});

app.get('/calendar-event/:id', async (req, res, next) => {
  const id = req.params.id;
  const calendarEvent = await CalendarEvent.findById(id);
  console.log(calendarEvent);
  res.status(200).json(calendarEvent);
});

app.post('/calendar-event', async (req, res, next) => {
  console.log(req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: 'content cannot be empty' });
    return;
  }
  const userId = req.body.user_id;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Missing properties' });
  }

  // new event
  const event = new CalendarEvent({
    location: req.body.location,
    startTime: req.body.start_time,
    endTime: req.body.end_time,
    reminderTime: req.body.reminder_time,
    title: req.body.title,
    description: req.body.description,
    allDay: req.body.all_day,
    userId,
  });

  // save event in the database

  await event.save();
  res.status(201).json({ status: 'ok' });
});

app.patch('/calendar-event', async (req, res, next) => {
  const { id, userId, ...updatedData } = req.body;
  try {
    const calendarEvent = await CalendarEvent.findById(id);
    if (calendarEvent.userId != userId) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Calendar Event does not belong to user' });
    }
    console.log(updatedData);
    await calendarEvent.update(updatedData);
    res.status(200).json({ status: 'ok', message: 'Calendar event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating calendar event' });
  }
});

app.delete('/calendar-event/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    await CalendarEvent.deleteOne({ _id: id });
    res.status(200).json({ status: 'ok', message: 'Calendar event deleted successfully' });
  } catch (error) {
    // TODO change this to use a logger
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error while deleting calendar event' });
  }
});

app.post('/reset-password/:token', async (req, resp, next) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    console.log(token);
    const resetToken = await PasswordResetToken.findOne({ token });
    const id = resetToken?.userId;
    const validuser = await UserModel.findById(id);
    if (validuser) {
      const cushashedPassword = await bcryptjs.hash(password, 8);
      const setnewuserpassword = await UserModel.findByIdAndUpdate(
        { _id: id },
        { hashPassword: cushashedPassword }
      );
      await setnewuserpassword.save();
      if (setnewuserpassword) {
        console.log('password set');
        console.log(validuser.email);
        sendResetConfirmMail(validuser.email);
        await resetToken.delete();
        return resp.status(201).json({ status: 201, message: 'password changed successfully' });
      } else {
        console.log('password not set');
      }
    } else {
      resp.status(401).json({ status: 401, message: 'Invalid password reset token' });
    }
  } catch (e) {
    console.log({ error: e });
    resp.status(401).json({ status: 500, message: 'Something went wrong. please try again' });
  }
});

app.get('/saved-lists', async (req, res, next) => {
  const userId = req.query.userId;
  const query = decodeURIComponent(req.query.q);
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid user' });
  }

  let savedLists;
  console.log({ query });
  try {
    if (query !== 'undefined') {
      console.log('if');
      savedLists = await SavedList.find({
        userId,
        title: { $regex: new RegExp(`.*${query}.*`, 'i') },
      }).populate('historicalEvents');
    } else {
      console.log('else');
      savedLists = await SavedList.find({ userId }).populate('historicalEvents');
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error while getting saved lists' });
  }

  console.log(savedLists);
  res.status(200).json(
    savedLists.map((list) => {
      return {
        id: list._id,
        title: list.title,
        historicalEvents: list.historicalEvents || [],
      };
    })
  );
});

app.get('/saved-lists/:id', async (req, res, next) => {
  const id = req.params.id;
  const userId = req.query.userId;
  try {
    const savedList = await SavedList.findById(id).populate('historicalEvents');
    //console.log(savedList, userId);
    if (savedList.userId != userId) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Saved list does not belong to user' });
    }
    console.log(savedList);
    res.status(200).json({
      id: savedList._id,
      title: savedList.title,
      historicalEvents: savedList.historicalEvents || [],
    });
  } catch (error) {
    // TODO - add logging with pino
    res.status(500).json({ status: 'error', message: 'Error while getting saved list' });
  }
});

app.patch('/saved-lists/:id', async (req, res, next) => {
  const id = req.params.id;
  const { userId, historicalEventId, action } = req.query;

  if (!VALID_SAVED_LIST_ACTIONS.includes(action)) {
    return res
      .status(400)
      .json({ status: 'error', message: `Invalid action for saved list: ${action}` });
  }

  try {
    const savedList = await SavedList.findById(id);
    if (savedList.userId != userId) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Saved list does not belong to user' });
    }

    const historicalEvent = await HistoricalEvent.findById(historicalEventId);
    if (!historicalEvent) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid historical event specified' });
    }

    if (action === 'addEvent') {
      savedList.historicalEvents.push(historicalEvent);
      await savedList.save();
      res.status(200).json({ status: 'ok', message: 'Historical event added to saved list' });
    }

    if (action === 'removeEvent') {
      // TODO - check if there is a better way of doing this
      savedList.historicalEvents = savedList.historicalEvents.filter((e) => {
        e._id != historicalEvent._id;
      });
      await savedList.save();
      res.status(200).json({ status: 'ok', message: 'Historical event removed from saved list' });
    }
  } catch (error) {
    // TODO - add logging with pino
    res
      .status(500)
      .json({ status: 'error', message: 'Error while adding historical event to saved list' });
  }
});

app.post('/saved-lists', async (req, res, next) => {
  console.log(req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'content cannot be empty' });
  }

  const userId = req.body.user_id;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Invalid user' });
  }

  const list = new SavedList({
    title: req.body.title,
    userId,
  });
  await list.save();
  res.status(201).json({ status: 'ok', _id: list._id });
});

app.delete('/saved-lists/:id', async (req, res, next) => {
  const id = req.params.id;
  const userId = req.query.userId;
  try {
    const savedList = await SavedList.findById(id);
    if (savedList.userId != userId) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Saved list does not belong to user' });
    }
    await savedList.delete();
    // TODO - add logging with pino
    // TODO - add functions to create success/error messages
    res.status(200).json({ status: 'ok', message: 'Saved List deleted successfully' });
  } catch (error) {
    // TODO - add logging with pino
    res.status(500).json({ status: 'error', message: 'Error while deleting saved list' });
  }
});

app.get('/historical-events', async (req, res, next) => {
  // TODO add optional query for title
  const { userId, savedListId } = req.query;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid user' });
    }

    const savedList = await SavedList.findById(savedListId).populate('historicalEvents');
    if (!savedList) {
      return res.status(400).json({ status: 'error', message: 'Invalid saved list' });
    }

    res.status(200).json({ historicalEvents: savedList.historicalEvents });
  } catch (error) {
    // TODO - add logging with pino
    res.status(500).json({ status: 'error', message: 'Error while getting historical events' });
  }
});

app.delete('/historical-events/:id', async (req, res, next) => {
  const historicalEventId = req.params.id;

  try {
    const historicalEvent = await HistoricalEvent.findById(historicalEventId);
    await historicalEvent.delete();
    // TODO - add logging with pino
    // TODO - add functions to create success/error messages
    res.status(200).json({ status: 'ok', message: 'Saved List deleted successfully' });
  } catch (error) {
    // TODO - add logging with pino
    res.status(500).json({ status: 'error', message: 'Error while deleting saved list' });
  }
});

app.get('/checkusername/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    const findUsername = await UserModel.findOne({ username });
    if (findUsername) {
      res.status(200).json({ msg: 'false' });
    } else {
      res.status(200).json({ msg: 'true' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/login', async (req, resp, next) => {
  try {
    const { username, password } = req.body;
    console.log('auth controller login click');
    console.log(username);
    const user = await UserModel.findOne({ username });
    if (!user) {
      return resp
        .status(401)
        .send({ status: 401, message: 'Invalid Credentials. Please try again' });
    }

    const isMatch = await bcryptjs.compare(password, user.hashPassword);
    console.log(isMatch);
    if (!isMatch) {
      console.log('password not matched');
      return resp
        .status(401)
        .json({ status: 401, message: 'Invalid Credentials. Please try again' });
    }
    if (user && isMatch) {
      console.log('match every thing');
      const token = await user.generateAuthtoken();
      console.log('token ' + token);
      console.log('successful login');
      if (token) {
        console.log('token generated');
      } else {
        console.log('token not generated');
      }

      const result = {
        user,
        token,
      };
      console.log(result);

      return resp.status(201).json({ status: 201, result });
    } else {
      console.log('login not successfull');
      return resp
        .status(401)
        .send({ status: 401, message: 'Invalid Credentials. Please try again' });
    }
  } catch (e) {
    console.log({ e });
    return resp.status(500).json({ error: e.message });
  }
});

app.post('/registration', async (req, resp, next) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const data = UserModel(req.body);
    const existingUsername = await UserModel.findOne({ username });
    const existingUserEmail = await UserModel.findOne({ email });
    if (existingUserEmail) {
      return resp.status(401).json({ status: 401, message: 'This email is already used' });
    }

    if (!existingUserEmail && !existingUsername) {
      const cushashedPassword = await bcryptjs.hash(password, 8);
      let user = new UserModel({
        firstname,
        lastname,
        username,
        email,
        hashPassword: cushashedPassword,
      });
      user = await user.save();
      return resp.status(201).json({ status: 201, message: 'Signup Successfully' });
    }

    resp.json(user);
  } catch (e) {
    return resp.status(500).json({ error: e.message });
  }
  console.log(req.body['username']);
  console.log(req.body['email']);
  console.log(req.body['username']);
  console.log(req.body['username']);
  console.log('insert is called');
  // resp.send("hay "+req.body['username']);
});

app.post('/request-password-reset', async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'User not found' });
  }

  let token = await PasswordResetToken.findOne({ userId: user._id });
  if (!token) {
    token = await new PasswordResetToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();
  }

  console.log(token.token);
  try {
    sendResetMail(email, token.token);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error sending email' });
    console.log(error);
  }
  res.status(201).json({ status: 'ok' });
});

app.patch('/users/:id/update-password', async (req, res, next) => {
  const { id } = req.params;
  const { oldpassword, password } = req.body;
  console.log('change old passowrd');
  try {
    const validuser = await UserModel.findOne({ _id: id });
    if (validuser) {
      console.log('valid user');
    } else {
      console.log('not valid');
    }

    if (validuser) {
      const isMatch = await bcryptjs.compare(oldpassword, validuser.hashPassword);
      if (!isMatch) {
        console.log('password not matched');
        return res.status(401).send({ status: 401, message: 'Old password not matched' });
      } else {
        console.log('password  matched');
        console.log(oldpassword);
        console.log('newpass' + oldpassword);
        const cushashedPassword = await bcryptjs.hash(password, 8);
        const setnewuserpassword = await UserModel.findByIdAndUpdate(
          { _id: id },
          { hashPassword: cushashedPassword }
        );
        await setnewuserpassword.save();
        if (setnewuserpassword) {
          console.log('password set');
        } else {
          console.log('password not  set');
        }
        return res.status(201).send({ status: 201, message: 'password change successfully' });
      }
    } else {
      res.status(401).json({ status: 401, message: 'Old password not matched' });
    }
  } catch (error) {
    res.status(500).json({ status: 401, message: 'Password not changed' });
  }
});

app.delete('/users/:id', async (req, res, next) => {
  const userId = req.params.id;

  try {
    await UserModel.deleteOne({ _id: userId });
  } catch (error) {
    return res.status(500).json({ message: 'Error happened while deleting account', error });
  }

  res.status(200).json({ message: 'Account deleted successfully' });
});

app.post('/preferences/update', async (req, res, next) => {
  const { userId, eventCategory, action } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Invalid user' });
  }

  const preferences = eventCategory?.split(',').map((p) => p.trim());

  if (action == 'add') {
    preferences.forEach(async (p) => {
      await UserPreference.findOneAndUpdate(
        { userId, preference: p },
        { userId, preference: p },
        { upsert: true }
      );
    });
    return res.status(200).json({ status: 'ok', message: 'Preference added successfully' });
  } else if (action == 'remove') {
    preferences.forEach(async (p) => {
      await UserPreference.findOneAndDelete({ userId, preference: p });
    });
    return res.status(200).json({ status: 'ok', message: 'Preference removed successfully' });
  }

  res.status(400).json({ status: 'error', message: 'Invalid action' });
});

app.post('/historical-events', async (req, res, next) => {
  const { event, userId, savedListId, newSavedListName } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user || !event) {
      return res.status(400).json({ status: 'error', message: 'Invalid data' });
    }

    let savedList;

    if (newSavedListName.length > 0) {
      savedList = new SavedList({ title: newSavedListName, userId });
    } else {
      savedList = await SavedList.findById(savedListId);
    }

    if (savedList.userId != userId) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Saved list does not belong to user' });
    }

    const historicalEvent = new HistoricalEvent({
      title: event.title,
      description: event.description,
      url: event.url,
      savedList: savedList._id,
      date: event.pub_date,
    });
    await historicalEvent.save();
    savedList.historicalEvents.push(historicalEvent);
    await savedList.save();
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Error while saving historical event to list' });
  }

  res.status(200).json({ status: 'ok', message: 'Event saved to list successfully' });
});

app.get('/historical-events/random', async (req, res, next) => {
  const userId = req.query.userId;
  const user = UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Invalid user specified' });
  }

  try {
    const preferences = await UserPreference.find({ userId });

    const currentDate = new Date();
    const maxYear = currentDate.getFullYear() - 1;
    const randomYear = Math.floor(Math.random() * (maxYear - MIN_YEAR + 1) + MIN_YEAR);
    const queryMonth = getFormattedMonth(currentDate.getMonth() + 1);

    const queryDate = randomYear + queryMonth;
    const lastDate = getLastDate(currentDate.getMonth());

    const filterQuery = buildFilterQuery(preferences);
    const fieldQuery = encodeURIComponent(
      'abstract, web_url, multimedia, headline, news_desk, pub_date'
    );

    console.log({ queryDate });
    // Get events from start to end of month
    let historicalEvents = await (
      await fetch(
        `${ARTICLE_API_URL}?q=&begin_date=${queryDate}01&end_date=${queryDate}${lastDate}&fq=${filterQuery}&fl=${fieldQuery}&api-key=${API_KEY}&sort_order=relevance`
      )
    ).json();

    historicalEvents = historicalEvents.response?.docs || [];

    // If we get no results for preferences, ignore filters and get events again for all year
    if (historicalEvents.length < 6) {
      let randomHistoricalEvents = await (
        await fetch(
          `${ARTICLE_API_URL}?q=&begin_date=${randomYear}0101&end_date=${randomYear}1231&fl=${fieldQuery}&api-key=${API_KEY}&sort_order=relevance`
        )
      ).json();
      randomHistoricalEvents = randomHistoricalEvents.response?.docs || [];
      historicalEvents.push(...randomHistoricalEvents);
    }

    const filtered_events = historicalEvents
      .filter((e) => e.headline?.main?.length > 0 && !new RegExp(/No Title/).test(e.headline.main))
      .slice(0, 6)
      .map((e) => {
        return {
          title: e.headline.main,
          url: e.web_url,
          description: e.abstract,
          category: e.news_desk,
          multimedia: e.multimedia[0] || null,
          source: 'ny_times',
          pub_date: e.pub_date.slice(0, 10),
        };
      });

    res.status(200).json(filtered_events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Error while getting events' });
  }
});

app.get('/historical-event/:id', async (req, res, next) => {
  const id = req.params.id;
  const historicalEvent = await HistoricalEvent.findById(id).exec();
  console.log(historicalEvent);
  res.status(200).send(historicalEvent);
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 'ok',
    error: 'not found',
  });
});

app.listen(PORT, () => {
  console.log('running on http://localhost:' + PORT);
});

//MongoDB connection
connectDB();
