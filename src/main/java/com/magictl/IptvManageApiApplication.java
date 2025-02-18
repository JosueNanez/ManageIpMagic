package com.magictl;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ✅ Habilita tareas programadas
public class IptvManageApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(IptvManageApiApplication.class, args);
		
	}

}
