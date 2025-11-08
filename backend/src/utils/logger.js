import morgan from 'morgan';

const logger = () => {
  const format =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  return morgan(format, {
    skip: () => process.env.NODE_ENV === 'test',
  });
};

export default logger;

