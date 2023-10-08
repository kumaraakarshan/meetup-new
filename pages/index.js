import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      {/* Remove the extra semicolon here */}
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://kumaraakarshan:a0xl11nbQpgrkM1H@cluster0.sas6wqa.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    // Ensure that meetups have valid titles
    const validMeetups = meetups.map((meetup) => ({
      title: meetup.title || 'No Title',
      address: meetup.address || 'No Address',
      image: meetup.image || '',
      id: meetup._id.toString(),
    }));

    return {
      props: {
        meetups: validMeetups,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        meetups: [],
      },
      revalidate: 1,
    };
  }
}


export default HomePage;
