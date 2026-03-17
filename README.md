# TaskFlow

Sistema fullstack de gerenciamento de tarefas com quadro Kanban, desenvolvido com HTML/CSS/JavaScript no frontend e Java Spring Boot no backend.

---

## Preview

<p align="center">
  <img src="https://raw.githubusercontent.com/joseeneto19/taskflow/main/docs/images/preview.png" width="900"/>
</p>

## Conceitos Aplicados

### Backend
- Arquitetura em camadas (Controller → Service → Repository)
- Padrão REST com Spring Boot
- CRUD completo de tarefas
- DTOs para transferência de dados (separação entre modelo e resposta da API)
- Tratamento de exceções global com `@ControllerAdvice`
- Migrações de banco de dados com **Flyway**
- Documentação interativa da API com **Swagger (SpringDoc OpenAPI)**
- Validação de dados com **Bean Validation** (`@NotBlank`, `@NotNull`, etc.)
- Banco de dados PostgreSQL via **Docker**

### Frontend
- Integração com a API via `fetch`
- Manipulação de DOM com JavaScript puro (sem frameworks)
- Drag and Drop API nativa do HTML5
- Tema claro/escuro com CSS Variables
- Layout responsivo com CSS Grid

### Próximas melhorias
- Autenticação e autorização com **Spring Security + JWT**
- Testes unitários com **JUnit 5 + Mockito**
- Deploy em ambiente cloud (AWS, Railway ou Render)

---

## Endpoints da API (Em desenvolvimento)

Base URL: `http://localhost:8080/api`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tarefas` | Listar todas as tarefas |
| `GET` | `/tarefas/{id}` | Buscar tarefa por ID |
| `POST` | `/tarefas` | Criar nova tarefa |
| `PUT` | `/tarefas/{id}` | Atualizar tarefa completa |
| `PATCH` | `/tarefas/{id}/status` | Atualizar somente o status |
| `DELETE` | `/tarefas/{id}` | Excluir tarefa |

> Após a implementação da autenticação, todos os endpoints serão protegidos e exigirão um token JWT no header `Authorization: Bearer <token>`.

A documentação completa e interativa está disponível via Swagger em:
```
http://localhost:8080/swagger-ui.html
```



## Autor

Desenvolvido por **joseeneto19** 
