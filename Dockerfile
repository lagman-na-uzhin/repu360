FROM docker.elastic.co/beats/filebeat:8.0.0

COPY config/filebeat.yml /usr/share/filebeat/filebeat.yml

USER root
# RUN chown aibek:filebeat /usr/share/filebeat/filebeat.yml
RUN chown -R root usr/share/filebeat
RUN chown -R go-w usr/share/filebeat
# USER filebeat