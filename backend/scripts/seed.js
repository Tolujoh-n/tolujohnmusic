import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from '../src/config/db.js';
import Admin from '../src/models/Admin.js';
import HeroHighlight from '../src/models/HeroHighlight.js';
import About from '../src/models/About.js';
import Track from '../src/models/Track.js';
import Video from '../src/models/Video.js';
import TourDate from '../src/models/TourDate.js';
import MerchItem from '../src/models/MerchItem.js';
import Subscriber from '../src/models/Subscriber.js';
import ContactMessage from '../src/models/ContactMessage.js';

dotenv.config();

const seedData = async () => {
  await connectDB();

  await Promise.all([
    Admin.deleteMany(),
    HeroHighlight.deleteMany(),
    About.deleteMany(),
    Track.deleteMany(),
    Video.deleteMany(),
    TourDate.deleteMany(),
    MerchItem.deleteMany(),
    Subscriber.deleteMany(),
    ContactMessage.deleteMany(),
  ]);

  const admin = await Admin.create({
    name: 'Site Administrator',
    email: 'admin@tolujohnmusic.com',
    password: 'ChangeMe123!',
  });

  const hero = await HeroHighlight.create({
    songTitle: 'Heaven on Earth',
    tagline: 'Experience the new sound of worship',
    description:
      'Tolu John invites you into an atmosphere of hope with the latest single, Heaven on Earth.',
    ctaLabel: 'Stream the single',
    ctaUrl: 'https://open.spotify.com/track/example',
    backgroundImage:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80',
    releaseDate: new Date('2024-08-30'),
    platforms: [
      { name: 'Spotify', url: 'https://open.spotify.com/track/example' },
      { name: 'Apple Music', url: 'https://music.apple.com/album/example' },
      { name: 'YouTube Music', url: 'https://music.youtube.com/watch?v=example' },
    ],
  });

  const about = await About.create({
    heading: 'The Sound of Purpose',
    subheading: 'Award-winning gospel & inspirational artist',
    content:
      'Tolu John is a Nigerian-born, global music minister crafting heartfelt worship experiences that draw people closer to the presence of God. With a voice that carries both power and tenderness, Tolu blends modern gospel, afro-fusion, and soul to create a sound that feels both timeless and refreshing. Performing on stages across Europe and Africa, Tolu has shared concerts with international acts while mentoring young creatives across the continent.',
    achievements: [
      { label: 'Streams', value: '25M+' },
      { label: 'Awards', value: '6 International' },
      { label: 'Tours', value: '18 Countries' },
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=1200&q=80',
    quote: {
      text: 'My mission is to guide souls into moments where heaven feels near.',
      attribution: 'Tolu John',
    },
  });

  const tracks = await Track.create([
    {
      title: 'Heaven on Earth',
      description: 'A soaring anthem of faith recorded live in Lagos.',
      releaseDate: new Date('2024-08-30'),
      isFeatured: true,
      coverImage:
        'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1200&q=80',
      platforms: [
        { name: 'Spotify', url: 'https://open.spotify.com/track/example' },
        { name: 'Apple Music', url: 'https://music.apple.com/album/example' },
      ],
      genres: ['Gospel', 'Inspirational'],
    },
    {
      title: 'Rhythms of Grace',
      description: 'An afro-fusion worship groove featuring live percussion.',
      releaseDate: new Date('2023-11-12'),
      isFeatured: true,
      coverImage:
        'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=1200&q=80',
      platforms: [
        { name: 'Spotify', url: 'https://open.spotify.com/track/example2' },
        { name: 'YouTube', url: 'https://youtube.com/watch?v=example2' },
      ],
      genres: ['Gospel', 'Afrobeat'],
    },
    {
      title: 'Light in the Dark',
      description: 'A reflective ballad with cinematic strings.',
      releaseDate: new Date('2022-05-05'),
      coverImage:
        'https://images.unsplash.com/photo-1464375117522-1311d6a5b81a?auto=format&fit=crop&w=1200&q=80',
      platforms: [
        { name: 'Apple Music', url: 'https://music.apple.com/album/example3' },
        { name: 'Amazon Music', url: 'https://music.amazon.com/albums/example3' },
      ],
      genres: ['Gospel', 'Soul'],
    },
  ]);

  const videos = await Video.create([
    {
      title: 'Heaven on Earth (Official Live Video)',
      description: 'Captured live at the Lagos Worship Experience.',
      videoUrl: 'https://www.youtube.com/watch?v=dummyVideo1',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80',
      releaseDate: new Date('2024-09-10'),
      isFeatured: true,
    },
    {
      title: 'Behind the Song: Rhythms of Grace',
      description: 'Tolu shares the story behind the single.',
      videoUrl: 'https://www.youtube.com/watch?v=dummyVideo2',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      releaseDate: new Date('2024-01-15'),
    },
  ]);

  const tours = await TourDate.create([
    {
      title: 'Heaven on Earth Tour - London',
      venue: 'The Royal Albert Hall',
      city: 'London',
      country: 'United Kingdom',
      date: new Date('2025-02-18'),
      ticketUrl: 'https://tickets.example.com/london',
      vipUrl: 'https://tickets.example.com/london/vip',
    },
    {
      title: 'Heaven on Earth Tour - Atlanta',
      venue: 'Fox Theatre',
      city: 'Atlanta',
      country: 'USA',
      date: new Date('2025-03-05'),
      ticketUrl: 'https://tickets.example.com/atlanta',
    },
    {
      title: 'Grace & Glory - Johannesburg',
      venue: 'Ticketpro Dome',
      city: 'Johannesburg',
      country: 'South Africa',
      date: new Date('2025-04-12'),
      ticketUrl: 'https://tickets.example.com/johannesburg',
      isSoldOut: false,
    },
  ]);

  const merch = await MerchItem.create([
    {
      title: 'Heaven on Earth Hoodie',
      description: 'Premium heavyweight hoodie featuring the tour artwork.',
      price: 65,
      imageUrl:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shop.tolujohnmusic.com/products/hoodie',
      tags: ['apparel', 'limited'],
    },
    {
      title: 'Signed Vinyl - Rhythms of Grace',
      description: 'Limited edition signed vinyl with lyric booklet.',
      price: 45,
      imageUrl:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shop.tolujohnmusic.com/products/vinyl',
      tags: ['music', 'collectible'],
    },
  ]);

  const subscribers = await Subscriber.create([
    { email: 'fan1@example.com', source: 'seed' },
    { email: 'booking@worshiphub.co', source: 'seed' },
  ]);

  const messages = await ContactMessage.create([
    {
      name: 'Grace Events',
      email: 'hello@graceevents.co',
      message: 'We would love to host Tolu John at our annual gathering in May.',
    },
  ]);

  console.log(colors.green('Seed data imported successfully.'));
  console.log(
    colors.cyan(
      `Created: admin(${admin.email}), hero(${hero.songTitle}), tracks(${tracks.length}), videos(${videos.length}), tours(${tours.length}), merch(${merch.length}), subscribers(${subscribers.length}), messages(${messages.length})`
    )
  );

  process.exit();
};

const destroyData = async () => {
  await connectDB();
  await Promise.all([
    Admin.deleteMany(),
    HeroHighlight.deleteMany(),
    About.deleteMany(),
    Track.deleteMany(),
    Video.deleteMany(),
    TourDate.deleteMany(),
    MerchItem.deleteMany(),
    Subscriber.deleteMany(),
    ContactMessage.deleteMany(),
  ]);
  console.log(colors.yellow('All data destroyed.'));
  process.exit();
};

if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  seedData();
}

