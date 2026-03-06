package com.agms.zone_service.controller;

import com.agms.zone_service.entity.Zone;
import com.agms.zone_service.repository.ZoneRepository;
import com.agms.zone_service.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @Autowired
    private ZoneRepository zoneRepository;

    // 1. Create a new Zone
    @PostMapping
    public ResponseEntity<Zone> createZone(@RequestBody Zone zone) {
        try {
            Zone createdZone = zoneService.createZone(zone);
            return new ResponseEntity<>(createdZone, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 2. She all Zones
    @GetMapping
    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    // 3. Get Zone by ID
    @GetMapping("/{id}")
    public ResponseEntity<Zone> getZoneById(@PathVariable Long id) {
        return zoneRepository.findById(id)
                .map(zone -> new ResponseEntity<>(zone, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 4. Delete Zone
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id) {
        if (zoneRepository.existsById(id)) {
            zoneRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}