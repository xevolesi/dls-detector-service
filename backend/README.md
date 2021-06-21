# Запуск

1) Перейти в директорию с проектом и запустить `docker image build -t best_pyotar -f backend/Dockerfile .`;
2) Выполнить команду `docker container run -d --name pyotar_the_best -p 3001:80 best_pyotar`
3) В браузере зайти по адресу http://127.0.0.1:3001/docs