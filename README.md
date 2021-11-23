# Sorteador Formulaviral 🍀

O sorteador da agência Formulaviral surgiu para solucionar a dificuldade de se sortear muitos usuários ao mesmo tempo em posts de sorteio do Instagram. Além disso, eles precisariam passar antes por alguns requisitos para serem contemplados. O sorteador passou a fazer tudo isso de forma automatizada e com apenas poucos cliques.
<br>
<br>

## 🍜 Como foi desenvolvido?
Consumindo a `Facebook Graph API` e me dando as permissões necessárias para acessar os posts de um dos clientes da agência, a aplicação foi projetada para captar o ID do post escolhido e realizar diversas requisições no servidor do Instagram afim de escalar acesso até chegar nos seus comentários.

Já que a intenção era fazer essa captação em massa, com posts que iam de 400 a 900 comentários, houve a necessidade da utilização do `while` para que automatizasse o processo. Como o Facebook limita até 100 comentários por requisição, ele fez o trabalho de puxar todos até não haver mais páginas. 

Após captar todos os comentários, foi passado um `regex` para testar se cada um deles atendiam os requisitos da campanha. Nesse caso, a regra aqui era cada usuário marcar 2 arrobas ou mais para participar do sorteio. Os usuários que se encaixavam nas condições, iam para uma array denominada `winners`. 

Manipulando esta array, foi passado o objeto `Set`, para limpar os usuários repetidos e manter apenas os valores únicos. Agora bastava ativar o método `sort()`, do qual realiza o sorteio dentre os usuários que atenderam todos os requisitos, retornando uma quantidade de arrobas únicos de acordo com o que é escolhido no aplicativo.  

**Importante** notar que o sorteador só pode ser acessado via token. Ele é um token gerado pelo próprio Facebook que expira de 2 em 2 horas. Mesmo podendo prolongar a sua duração, eu decidi manter como chave provisória por questões de segurança. O token utilizado no arquivo desse repositório já foi devidamente revogado.
#
#### Créditos / Agradecimentos
_Projeto desenvolvido para a agência Formulaviral._

