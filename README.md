# **AlmatarLoyalty system**

AlmatarLoyalty is a simple web application that allows users to transfer their loyalty
points to each other.

# Project Setup

## Requirements:

- install docker
- install docker-compose
- MongoDB database

## To run project locally:

- Clone repo `git clone https://github.com/abdelrhmanali29/AlmatarLoyalty.git`
- Add your environment variables in `.env.example`
- Change `.env.example` to '.env.production`
- Run `docker-compose up --build` in root folder
- Use [postman](https://www.postman.com/downloads/) to test endpoints or curl if you're cool
- Can find API docs ([swagger](https://swagger.io/)) at [http://localhost:3000/api/v1/docs](http://localhost/api/v1/docs) **(username: admin, password: admin)**

## Features

- Signup, Login, Logout
- Get user profile and points
- Make transaction
- Confirm transaction
- List user successful transactions

## Overview

1. User sign up with his email and password. Every new users get 500 points as a gift.
2. Login by email and password then token will send on response.
3. User can get his profile at `/users/me` endpoint.
4. User can transfer points to another user by email.
5. After each transaction the sender user will get confirmation mail, and must confirm this transaction within 10 minutes.
6. To confirm transaction must send transaction info which received in confirmation mail.
7. User can list his successful transactions

## How to ...?

### Protect endpoints

- check if token is provided
- Verification token if not valid it will
- Check if user still exists in database
- Check if user changed password after the token was issued
- If everything is OK, return current use

### Transaction transfer

1- User send number of points want to transfer and receiver user email
2- Must sender user has more than or equal of points he will transfer
3- Must receiver user exists ans signed up
4- Then create new transaction and send email with transaction info to the sender user

### Transaction confirmation

- User send must send transaction info
- Perform database transaction to:
  1- Subtract sender points with number of transaction points
  2- Increase receiver points with number of transaction points
  3- Mark this transaction as confirmed
- If any error occurred through any operation all operations will aborted

## Security

- Set security HTTP headers
- Limit requests from same API
- Body parser, reading data from body into req.body
- Data sanitization against NoSQL query injection
- Data sanitization against XSS
- Prevent parameter pollution

## TODO in the future

- Email verification.
- Persistent login.
- Account lockout.
- Using caching in validations to speed them up.
