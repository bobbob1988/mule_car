package com.sfmotors.cloud.ptmonitor;

import com.sfmotors.cloud.ptmonitor.service.PTCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableAutoConfiguration
@EnableScheduling
public class PTMonitorApplication {

    @Autowired
	private PTCANWorker ptcanWorker;

	@Bean
	public TaskExecutor taskExecutor(){
		return new SimpleAsyncTaskExecutor();
	}

	@Bean
	public CommandLineRunner worker(TaskExecutor executor) {
		return new CommandLineRunner() {
			@Override
			public void run(String... args) throws Exception {
				executor.execute(ptcanWorker);
			}
		};
	}

	public static void main(String[] args) {
		ConfigurableApplicationContext ctx = SpringApplication.run(PTMonitorApplication.class, args);
		ctx.getBean(PTCommand.class).enableDebugBattery(true);
	}
}
