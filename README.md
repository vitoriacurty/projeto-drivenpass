# projeto-drivenpass

### Descrição

- Navegar na internet pode ser uma atividade muito divertida, mas ao mesmo tempo, muito perigosa. Inúmeros estudos e levantamentos (nacionais e internacionais) mostram que o número de golpes virtuais não para de crescer. O que levanta a questão: como nos proteger?
- Existem várias formas diferentes de se proteger. Tudo começa com o uso de senhas diferentes e seguras. Para uma senha ser segura, ela deve conter vários caracteres e números misturados, sem contar que o quanto mais longa ela for, melhor.
- *Só que como vamos memorizar senhas gigantes e sem significado semântico?* É para resolver essa dor que os **gerenciadores de senhas** surgiram! Com eles, criamos apenas uma senha “mestra” e todas as outras senhas ficam gravadas em segredo! Logo, quando precisamos dela, basta lembrar da senha “mestra”!
- Neste projeto, você ficará responsável por desenvolver a DrivenPass, um gerenciador de senhas!

### ✅ Requisitos

- Geral
    - [ ]  O *back-end* deve ser codificado em TypeScript e o front-end (bônus) em React com *styled-components*.
    - [ ]  Com o TypeScript, utilize types para tipar seus objetos e as tipagens das bibliotecas (através do @types).
    - [ ]  O banco de dados deve ser gerenciado via Prisma. Implemente *queries* SQL **somente se for extremamente necessário**.
    - [ ]  A API deverá seguir a *Layered Architecture* (*Routers*, *Controllers*, *Services* e *Repositories*).
    - [ ]  Versionamento usando Git é obrigatório, crie um **repositório público** no seu perfil do GitHub (um para o *front-end* e outro para o *back-end*).
    - [ ]  Faça *commits* a cada funcionalidade implementada.
- Usuários
    
    A aplicação deve fornecer uma forma das pessoas criarem contas e utiliza-las.
    
    - Criação de contas
        - O usuário deve fornecer um e-mail válido e uma senha para poder criar um usuário. Se o e-mail já estiver em uso, a aplicação não pode criar a conta. A senha precisa ter um mínimo de 10 caracteres. Por ser um dado extremamente sensível, a senha precisa ir para o banco criptografada. Utilize a biblioteca [bcrypt](https://www.npmjs.com/package/bcrypt) para isso.
    - Acesso de uma conta
        - O usuário deverá utilizar o e-mail e senha cadastrados. Caso ele forneça dados incompatíveis, a aplicação deverá avisá-lo. Ao finalizar o login, ele deverá receber um token baseado na estratégia JWT. Utilize a biblioteca [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) para isso.
        - **Esse token deverá ser enviado em todas as requisições para identificar o usuário.**
- Credenciais
    
    Credenciais se referem a informações de login para um site e/ou serviço.
    
    - Criação de credenciais
        - Para registrar uma nova credencial, o usuário deverá fornecer uma url, um nome de usuário e uma senha. O usuário também precisa informar um título/nome/rótulo para essa credencial, uma vez que é possível cadastrar duas credenciais para um mesmo site.
        - Cada credencial deve possuir um título/nome/rótulo único, ou seja, se o usuário tentar criar duas credenciais com o mesmo nome, a aplicação deve impedi-lo (o que não impede que outras pessoas usem esse título).
        - Por ser um dado sensível, o campo de senha da credencial deve ser criptografado usando um segredo da aplicação. Use a biblioteca [cryptr](https://www.npmjs.com/package/cryptr) para isso.
    - Busca de credenciais
        - A aplicação deve fornecer uma forma de obter todas as credenciais ou uma credencial específica (através do seu id). Se o usuário procurar por uma credencial que não é dele ou que não existe, a aplicação deve avisar.
        - Todas as credenciais retornadas devem aparecer com a senha descriptografada.
    - Deleção de credenciais
        - Aplicação deve permitir que uma credencial seja deletada (dado o seu id). Se o id não existir ou pertencer a credencial de outra pessoa, a aplicação deve avisar.