package com.andrei.car_management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Marca nu poate fi goală")
    private String marca;

    @NotBlank(message = "Modelul nu poate fi gol")
    private String model;

    @NotNull(message = "Anul nu poate fi null")
    @Min(value = 1886, message = "Anul trebuie să fie mai mare decât 1886")
    private Integer an;

    @NotNull(message = "Prețul nu poate fi null")
    @Min(value = 1, message = "Prețul trebuie să fie pozitiv")
    private Double pret;
}


