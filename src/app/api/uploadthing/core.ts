import { auth } from 'auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  if (!session || !session.user?.email) {
    throw new Error('Unauthorized');
  }
  const userEmail = session.user.email;
  return { userEmail };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
