package com.magictl.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/principal")
public class DashboardController {
	
	@GetMapping("/")
	public String principal() {
		return "index";
	}
	

}
