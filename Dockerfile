
FROM ubuntu:noble

RUN apt-get update && apt-get -y install curl 

# descargando nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

RUN /bin/sh "/root/.nvm/nvm.sh" 

# editar .bashrc, quitar $HOME por /root/.nvm
# ejecutar RUN source /root/.bashrc

# instalando npm 22
# RUN nvm install 22 && npm -v 

WORKDIR /app

EXPOSE 80

CMD ["bash"]
# aun con --yes me pide verificacion, hay que cambiar eso
# RUN npx create-next-app@latest gallery --yes
# RUN npm install gsap @gsap/react
# RUN npm install @aws-sdk/client-s3


# RUN cd gallery && npm run dev

# docker run -it --name gallery -p 80:80 -v /home/gasalinas/Documents/Repos/galleryVolume:/app 33b6abf9e8777896bc60aabfaf38f949da8b635d4cda485cfdfaffef7cc26c73