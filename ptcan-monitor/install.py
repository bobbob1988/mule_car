import os

redstone = os.path.join("lib", "RedstoneChips-beta.jar")
os.system("mvn install:install-file -Dfile=%s -DgroupId=org.tal -DartifactId=redstonechips -Dversion=1.0 -Dpackaging=jar" % redstone)

