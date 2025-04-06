// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres' // database-adapter-import
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { UsersCollection } from './collections/user';
import { MediaCollection } from './collections/media';
import { MoviesCollection } from './collections/movie'
import { TagsCollection } from './collections/tag'



const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: UsersCollection.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [UsersCollection, MediaCollection, MoviesCollection,TagsCollection],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  db: postgresAdapter({
    pool: {
			connectionString: process.env.DATABASE_URI || '',
		}
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  onInit: async (payload) => {

    const users = await payload.find({
      collection: 'users',
    });
      
    if(users.docs.length == 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@gmail.com',
          password: '123',
          role: "admin",
        },
      });
    }
  }
});