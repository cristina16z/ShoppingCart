export type Guitar = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
};

//herencia completa de Guitar y + lo que quieras añadir
export type CartItem = Guitar & {
    quantity: number;
};



/*2.herencia de todos los elementos menos los que se indica seria con Omit en vez Pick
1.herencia sólo de los elementos que quieras + lo que quieras añadir

export type CartItem = Pick<Guitar, 'id' | 'name' | 'price'> & {
    quantity: number
}*/
