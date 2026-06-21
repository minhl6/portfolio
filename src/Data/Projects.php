<?php

namespace App\Data;

final class Projects
{
    public const ALL = [
        'robotic-arm-design' => [
            'title' => 'Robotic Arm Design',
            'category' => 'personal',
            'tagline' => '5-DOF robotic arm with a custom gripper mechanism',
            'image' => 'https://picsum.photos/seed/robotic-arm-design/1200/800',
            'tools' => ['SolidWorks', 'Arduino', '3D Printing'],
            'summary' => 'A desktop-scale robotic arm built to explore mechanism design, motor control, and inverse kinematics.',
            'description' => [
                'Replace this with the real story of your project: the problem you set out to solve, the constraints you were working under, and the approach you took.',
                'Talk through key design decisions — link lengths, actuator selection, gripper geometry — and any iteration based on testing.',
                'Wrap up with results, what you learned, and what you would do differently next time.',
            ],
        ],
        'laser-cut-enclosure' => [
            'title' => 'Laser-Cut Enclosure',
            'category' => 'personal',
            'tagline' => 'Parametric acrylic enclosure for an electronics project',
            'image' => 'https://picsum.photos/seed/laser-cut-enclosure/1200/800',
            'tools' => ['Fusion 360', 'Laser Cutting', 'Acrylic'],
            'summary' => 'A snap-fit enclosure generated from parametric sketches, designed for quick iteration on a laser cutter.',
            'description' => [
                'Describe the enclosure requirements: what it needed to house, tolerances, and assembly method (finger joints, snap-fit, fasteners).',
                'Explain your parametric design approach and how it sped up iteration between cutting tests.',
                'Note any lessons learned about kerf compensation, material choice, or fit tolerances.',
            ],
        ],
        'fea-bracket-analysis' => [
            'title' => 'FEA Bracket Analysis',
            'category' => 'school',
            'tagline' => 'Structural optimization of a mounting bracket',
            'image' => 'https://picsum.photos/seed/fea-bracket-analysis/1200/800',
            'tools' => ['SolidWorks Simulation', 'ANSYS', 'Topology Optimization'],
            'summary' => 'A finite element study used to reduce mass in a structural bracket while keeping it within stress and deflection limits.',
            'description' => [
                'Outline the loading conditions, boundary conditions, and material assumptions used in the analysis.',
                'Show the iteration from initial design to optimized geometry, referencing stress plots or factor-of-safety results.',
                'Summarize the final mass reduction achieved and how the result was validated.',
            ],
        ],
        'go-kart-suspension' => [
            'title' => 'Go-Kart Suspension',
            'category' => 'school',
            'tagline' => 'Double wishbone suspension for a student go-kart team',
            'image' => 'https://picsum.photos/seed/go-kart-suspension/1200/800',
            'tools' => ['SolidWorks', 'Suspension Kinematics', 'Manufacturing'],
            'summary' => 'A double wishbone suspension system designed and manufactured as part of a student design team.',
            'description' => [
                'Explain the design targets: ride height, camber/caster behavior, track conditions, and packaging constraints.',
                'Walk through the kinematic analysis and how it informed control arm geometry.',
                'Cover manufacturing and testing, including any on-track tuning or changes made after build.',
            ],
        ],
    ];
}
