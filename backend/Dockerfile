FROM ubuntu:latest

# Ubuntu stuff.
RUN apt update && apt upgrade -y
RUN apt install -y python3.8 python3.8-dev python3.8-distutils
RUN apt install -y libpng-dev libjpeg-dev libtiff-dev wget curl libgl1-mesa-glx
RUN TZ="Russia/Moscow" apt-get install -y tzdata
RUN apt-get install -y libgtk2.0-dev
RUN apt-get install -y ffmpeg
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3.8 get-pip.py
RUN python3.8 -m pip install --upgrade pip

# App stuff.
COPY requirements.txt .
RUN python3.8 -m pip install -r requirements.txt
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
#ENV HOME=/usr/src/app/backend
RUN mkdir -p /usr/src/app/models
RUN wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1PDL57B4Wtwu-wnvcF_MGx3vQtvek3nFa' -O models/yolov5s.simp.onnx

EXPOSE 80

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
