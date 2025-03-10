import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { database } from '@/lib/database';

// take email as a param and return verification token
export const generateVerificationToken = async (email: string) => {
    // TODO: generate verification token
    // we need to create a random string for our verification token, ill use uuid (npm package to randomly generate token string)
    const token = uuidv4();
    const timer = .5 * (60 * 60 * 1000); // expires after 30 mins, (60ms x 60ms x 1000ms = 1hr)
    const expiration = new Date(Date.now() + timer);


    // check if token already exists in case of resending verification email
    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
        // if exists then database.ts will use prisma to access db and delete where id === existingToken.id
        await database.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    // at this point our users either dont have a verification token or we have deleted it for them (multiple token requests)
    // so we must create a new one
    const verificationToken = await database.verificationToken.create({
        data: {
            email: email,
            token: token,
            expires: new Date(expiration)
        }
    })

    return verificationToken;
}