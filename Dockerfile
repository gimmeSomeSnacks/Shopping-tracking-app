FROM gradle:8.7-jdk as build

COPY --chown=gradle:gradle . /project

WORKDIR /project

RUN gradle build --no-daemon -x test

FROM openjdk:23

WORKDIR /app

COPY --from=build /project/build/libs/TrackingApp-0.0.1-SNAPSHOT.jar /app/TrackingApp.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "TrackingApp.jar"]