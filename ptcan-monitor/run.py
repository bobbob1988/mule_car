import os
jar = os.path.join("target", "ptmonitor-0.0.1-SNAPSHOT.jar")
os.system("mvn clean install -DskipTests")
os.system("java -Djava.library.path=lib -jar %s" % jar)
