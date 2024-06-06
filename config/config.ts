import * as dotenv from 'dotenv'
import path from 'path'
import joi from 'joi'

dotenv.config({
    path: path.join(process.cwd(), '.env')
})

const envVarsSchema = joi.object().keys({
    NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
    PORT: joi.number().default(4000),
    JWT_SECRET: joi.string().required().description('Jwt secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: joi.number().default(200),
    JWT_REFRESH_EXPIRATION_DAYS: joi.number().default(20).description('access token expiration time in minutes'),
    // SMTP_HOST: joi.string().description('server that will send the emails'),
    // SMTP_PORT: joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: joi.string().description('username for email server'),
    // SMTP_PASSWORD: joi.string().description('password for email server'),
    // EMAIL_FROM: joi.string().description('the from field in the emails sent by the app'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number()
        .default(30)
        .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number()
        .default(1440)
        .description('minutes after which verify email token expires'),
  
}).unknown()

const { value, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {

    console.log(`Environment variables are not set properly ${error.message}`)
    process.exit(1)
}

let config = {
    env: value.NODE_ENV,
    port: value.PORT,
    jwt: {
        secret: value.JWT_SECRET,
        accessExpirationMinutes: value.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: value.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: value.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: value.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    },
 

    email: {
        smtp: {
            host: value.SMTP_HOST,
            port: value.SMTP_PORT,
            auth: {
                user: value.SMTP_USERNAME,
                pass: value.SMTP_PASSWORD
            }
        },
        from: value.EMAIL_FROM
    }
}

export default config