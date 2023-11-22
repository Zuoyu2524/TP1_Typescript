import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers/user.controller'
import { checkRole, checkRolePlus } from '../middleware/auth.middleware';

async function userRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.listUsers,
  preHandler: checkRole(['Admin', 'Player', 'Reporter']),
  })

  //Création d’un utilisateur avec un email + mot de passe avec un payload JSON
  fastify.route({
	method: 'POST',
	url: '/adduser',
	handler: controllers.addUser,
  preHandler: checkRole(['Admin', 'Player']),
  })

  //Mettre à jour les informations d’un utilisateur avec un payload JSON
  fastify.route({
    method: 'PUT',
    url: '/users/:id',
    handler: controllers.updateUser,
    preHandler: checkRolePlus(['Admin', 'Player']),
  })

  //Effacer un utilisateur en mode soft-delete
  fastify.route(
    {
       method: 'PUT',
       url: '/deleteuser',
       handler: controllers.deleteUser,
       preHandler: checkRole(['Admin']),
    })

  //voir les utilisateurs effacés
  fastify.route({
    method: "GET",
    url: '/userdeleted',
    handler: controllers.getDeletedUser,
    preHandler: checkRole(['Admin']),
  })

  //Trouver un utilisateur par son id : GET users/123
  fastify.route({
    method: 'GET',
    url: '/users/:id',
    handler: controllers.getUser,
    preHandler: checkRolePlus(['Admin', 'Reporter']),
  })
  
  //Trouver un utilisateur par son nom
  fastify.route({
    method: 'GET',
    url: '/users',
    handler: controllers.getUserbyName,
    preHandler: checkRole(['Admin', 'Reporter']),
  })

}

export default userRouter