import Navbar from "../component/navbar";
import { $, reRender } from "../ultil";
import swal from "sweetalert";

export default class assignment {
  async render() {
    let listImg: string = "";

    const pokemons: number = 10;

    interface PokemonInterface {
      id: number;
      image: string;
    }

    let arrPokemon: PokemonInterface[] = [];

    for (let i = 1; i <= pokemons; i++) {
      let data: any = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      let pokemon: any = await data.json();
      arrPokemon = [
        ...arrPokemon,
        { id: pokemon.id, image: pokemon.sprites.front_default },
      ];
    }

    const cardPokemon: any = arrPokemon.concat(arrPokemon);

    cardPokemon.sort(() => {
      return Math.random() - 0.5;
    });

    cardPokemon.forEach((item: any, index: number) => {
      listImg += `
      <div class=" col-3 mb-3" >
        <article class="flashcard" id="flashcard_${index}" >
          <input type="checkbox" id="idInput_${index}" data-focus="${item.id}" index="${index}" checked class="pokeEle"/>
          <label for="idInput_${index}">
            <section class="front">
            <img src="../../img/box.png" height="150px">
            </section>
            <section class="back">
            <img src="${item.image}" height="150px">
            </section>
          </label>
        </article>
      </div>
      `;
    });

    $("#navbar").innerHTML = await Navbar.render();
    $(".point").innerHTML = "Điểm: 0";

    return `${listImg}`;
  }

  async afterRender() {
    let focusPokemon: HTMLElement[] = [];
    let totalPoint: number = 0;
    let countToEnd: number = 0;
    const userName: string = localStorage.getItem("user");
    const pokeList: HTMLInputElement[] = $(".pokeEle");

    setTimeout(() => {
      for (let i = 0; i < pokeList.length; i++) {
        $(`#flashcard_${i} .pokeEle`).checked = false;
      }
      swal("Trò chơi bắt đầu");
    }, 2000);

    // Play Game

    pokeList.forEach((item: HTMLInputElement) => {
      item.addEventListener("click", () => {
        focusPokemon = [...focusPokemon, item];

        if (focusPokemon.length === 2) {
          if (
            focusPokemon[0].getAttribute("data-focus") ==
              focusPokemon[1].getAttribute("data-focus") &&
            focusPokemon[0].getAttribute("index") !=
              focusPokemon[1].getAttribute("index")
          ) {
            focusPokemon.map((ele: HTMLInputElement) => {
              setTimeout(() => {
                $(`#flashcard_${ele.getAttribute("index")}`).style.display =
                  "none";
              }, 1500);
            });

            totalPoint += 100;
            countToEnd += 1;
          } else {
            focusPokemon.map((ele: HTMLInputElement) => {
              const isCheched = $(`#${ele.id}`);
              $(`#flashcard_${ele.getAttribute("index")}`);
              isCheched.parentNode.classList.add("bounce");
              console.log();

              setTimeout(() => {
                isCheched.parentNode.classList.remove("bounce");
                isCheched.checked = false;
              }, 1300);
            });
            if (totalPoint > 0) {
              totalPoint -= 50;
            }
          }

          focusPokemon = [];

          $(".point").innerHTML = "Điểm: " + totalPoint;
        }

        if (countToEnd === 10) {
          swal(
            "Chúc mừng!",
            `${userName} đã dành chiến thắng với số điểm là: ${totalPoint}`
          );

          swal({
            title: "Bạn có muốn chơi lại",
            text: "Click outside to cancel",
            icon: "warning",
            dangerMode: false,
          }).then(async (willDelete: boolean) => {
            if (willDelete) {
              swal("Chơi lại thành công", {
                icon: "success",
              });
              reRender(Assignment, "#content");
            } else {
              swal("Bạn đã hủy!");
            }
          });
        }
      });
    });

    // play again
    const Assignment = new assignment();
    const restartBtn: HTMLElement = $("#navbar .restart");
    restartBtn.addEventListener("click", async function () {
      swal({
        title: "Bạn chắc chắn muốn chơi lại",
        text: "Click outside to cancel",
        icon: "warning",
        dangerMode: true,
      }).then(async (willDelete: boolean) => {
        if (willDelete) {
          swal("Chơi lại thành công", {
            icon: "success",
          });
          reRender(Assignment, "#content");
        } else {
          swal("Bạn đã hủy!");
        }
      });
    });

    // Đăng xuất game
    const logoutBtn: HTMLElement = $("#navbar .logout");
    logoutBtn.addEventListener("click", async function () {
      localStorage.removeItem("user");
      $("#navbar").innerHTML = "";
      window.location.hash = "";
    });
  }

  // const showStroke = (value) => {

  //   var c = document.getElementById("myCanvas");
  //   var ctx = c.getContext("2d");
  //   ctx.moveTo(49, 90);
  //   ctx.lineTo(350, 634);
  //   ctx.stroke();

  //   c.classList.add("custom")

  //   setTimeout(() => {
  //     c.classList.remove("custom")
  //   }, 3000)

  // }

  // const findPos = (element) => {
  //   var rect = element.getBoundingClientRect();
  //   console.log("top: " ,rect.top,"right: " , rect.right,"bottom: " , rect.bottom,"left: " , rect.left);
  //   let hypotenuse = Math.sqrt(Math.pow((rect.height), 2) + Math.pow((rect.width), 2))
  //   console.log(rect);
  //   console.log(hypotenuse);
  // }
}
