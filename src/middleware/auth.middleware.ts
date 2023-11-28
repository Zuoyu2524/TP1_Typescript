import fastify from 'fastify';
import { getUserById } from '../controllers/user.controller'; 

const server = fastify();

export const checkRole = (requiredRoles: string[]) => {
    return (request, reply, next) => {
      const userRole: string = request.headers['role']; 
      console.log(userRole);
      console.log(requiredRoles);
  
      if (requiredRoles.includes(userRole) || userRole === 'Admin') {
        next(); // L'utilisateur a le rôle requis ou est un administrateur
      } else {
        reply.status(403).send({ error: 'Permission denied' });
      }
    };
  };
//Vérifier le caractère et vérifier que les informations demandées par le joueur sont celles de quelqu'un d'autre.
export const checkRolePlus = (requiredRoles: string[]) => {
  return async (request, reply, next) => { // Make the middleware function async
    try {
      const userRole = request.headers['role'];
      const requestName = request.headers['name'];
      const paramId = request.params.id;

      if (userRole === 'Admin' || requiredRoles.includes(userRole)) {
        next();
      } else {
        if (userRole === 'Player') {
          const result = await getUserById(paramId); // Await the asynchronous function
          console.log(`Output from /users/name/${paramId}:`, result);
          reply.status(200).send({ message: `Player ${requestName} demande les informations de l'utilisateur ${result.name}` });
        } else {
          reply.status(403).send({ error: 'Permission denied' });
        }
      }
    } catch (e) {
      console.error('Error in checkRolePlus middleware:', e);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  };
};