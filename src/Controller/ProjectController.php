<?php

namespace App\Controller;

use App\Data\Projects;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProjectController extends AbstractController
{
    #[Route('/projects/{slug}', name: 'app_project_show')]
    public function show(string $slug): Response
    {
        $project = Projects::ALL[$slug] ?? null;

        if ($project === null) {
            throw $this->createNotFoundException('Project not found.');
        }

        return $this->render('project/show.html.twig', [
            'slug' => $slug,
            'project' => $project,
        ]);
    }
}
