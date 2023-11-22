// Vérification des rôles uniquement
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
    return (request, reply, next) => {
      const userRole = request.headers['role']; 
      const requestId = request.headers['id']; 
      const paramId = request.params.id;
  
      if (userRole === 'Admin' || requiredRoles.includes(userRole) || (requestId === paramId&&userRole === 'Player')) {
        next();
      } else {
        if(userRole === 'Player'){
          console.log(`Player ${request.headers['user-name']} demande les informations de l'utilisateur ${requestId}`);
          next();
        }else{
          reply.status(403).send({ error: 'Permission denied' });
        }
        
      }
    };
  };
  
  
  