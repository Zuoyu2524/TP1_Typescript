import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import {pool} from '../db/pgPool'

export const addUser = async (request: 
  FastifyRequest<{ Body: { "name"?: string, "email"?: string, "password"?: string, "role"?: string } }>, 
  reply: FastifyReply) => {
  try {
    const { name, email, password, role } = request.body;

    // Check if all the information property exists and is not null
    if (!name) {
      return reply.status(400).send({ error: 'Name is required.' });
    }

    if (!email) {
      return reply.status(400).send({ error: 'Email is required.' });
    }

    if (!password) {
      return reply.status(400).send({ error: 'Password is required.' });
    }

    if(!role) {
      return reply.status(400).send({ error: 'Role is required.' });
    }

    // Create an object representing the row to be inserted
    const userRow = { name, email, password, role };

    // Insert the new user into the 'users' table
    const newUser = await db.insert('users', [userRow]).run(pool);

    reply.send({ data: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const listUsers = 
  async (request: FastifyRequest, reply: FastifyReply) => {
    return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`
    .run(pool)
    .then((users) => ({ data: users }))
};

// PUT /users/:id
export const updateUser = async (request: 
  FastifyRequest<{ Params: { id: string }; Body: { "name"?: string, "email"?: string, "password"?: string, "role"?: string, "score": number } }>, 
  reply: FastifyReply) => {
  try {
    const userId: number = parseInt(request.params.id, 10);

    // Check if userId is a valid number
    if (isNaN(userId)) {
      return reply.status(400).send({ error: 'Invalid user ID.' });
    }
    const { name, email, password, role, score } = request.body;

    if(score){
    // Check if score is a valid number
      if (isNaN(score)) {
        return reply.status(400).send({ error: 'Invalid score.' });
      }

      const query = `
        UPDATE ${"users"} SET score = ${score} WHERE user_id = ${userId}`;
      await pool.query(query);
    }

    if(name){
      const query = `
      UPDATE ${"users"} SET name = $1 WHERE user_id = ${userId}`;

      await pool.query(query, [name]);
    }

    if(email){
      const query = `
      UPDATE ${"users"} SET email = $1 WHERE user_id = ${userId}`;

      await pool.query(query, [email]);
    }

    if(password){
      const query = `
      UPDATE ${"users"} SET password = $1 WHERE user_id = ${userId}`;

      await pool.query(query, [password]);
    }

    if(role){
      const query = `
      UPDATE ${"users"} SET role = $1 WHERE user_id = ${userId}`;

      await pool.query(query, [role]);
    }

    reply.send({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (request: 
  FastifyRequest<{ Body: { userId: number } }>, 
  reply: FastifyReply) => {
  try {
    const { userId } = request.body;
    // Check if userId is a valid number
    if (isNaN(userId)) {
      return reply.status(400).send({ error: 'Invalid user ID.' });
    }

    const del:Boolean = true;

    const query = `
      UPDATE ${"users"} SET isDeleted = ${del} WHERE user_id = ${userId}`;

      reply.send({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getDeletedUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const del:Boolean = true;

    const query = `
      SELECT * FROM ${"users"} WHERE isDeleted = ${del}`;
    await pool.query(query);
    const { rows: users } = await pool.query(query);

    reply.send({ data: users });
  } catch (error) {
    console.error('Error updating user:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};


// GET /user/:id
export const getUser = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const userId: s.users.Selectable["user_id"] = parseInt(request.params.id, 10);

    const query = `
      SELECT * FROM ${"users"} WHERE user_id = ${userId}`;

    const { rows: users } = await pool.query(query);
    const user = users[0];

    if (!user) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    reply.send({ data: user });
  } catch (error) {
    console.error('Error getting user:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getUserbyName = async (
  request: FastifyRequest<{ Querystring: { name: string } }>,
  reply: FastifyReply
) => {
  try {
    const userName: string = request.query.name;

    const query = `
      SELECT * FROM users WHERE name = $1`;

    const { rows: users } = await pool.query(query, [userName]);
    const user = users[0];

    if (!user) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    reply.send({ data: user });
  } catch (error) {
    console.error('Error getting user:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export * from './user.controller';

/*
// get user method without database
export const getUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply) => {
  const id = parseInt(request.params.id, 10);
  const user = staticUsers.find((u) => u.id === id);

  if (user) {
    reply.send({ data: user });
  } else {
    reply.status(404).send({ error: 'User not found' });
  }

  console.log('getUser');
};*/

/*
// add user method without database
export const addUser = async (
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply) => {
  const { name } = request.body;

  if (!name) {
    reply.status(400).send({ error: 'Name is required' });
    return;
  }

  const newUser: IUser = {
    id: staticUsers.length + 1,
    name,
  };

  staticUsers.push(newUser);

  reply.status(201).send({ data: newUser });

  console.log('addUser');
};

// update user without database
export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: { score: number } }>,
  reply: FastifyReply) => {
  const userId = parseInt(request.params.id, 10);
  const { score } = request.body;

  const userIndex = staticUsers.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    staticUsers[userIndex].score = score;
    reply.send({ data: staticUsers[userIndex] });
  } else {
    reply.status(404).send({ error: 'User not found' });
  }

  console.log('updateUser');
};*/
