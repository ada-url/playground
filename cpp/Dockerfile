FROM drogonframework/drogon:latest

WORKDIR /app

COPY . .

RUN cmake -DCMAKE_BUILD_TYPE=Release -B build && \
    cmake --build build

EXPOSE 4242

CMD ["build/playground"]
