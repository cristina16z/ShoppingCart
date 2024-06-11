import {useState, useEffect, useMemo} from 'react'
import { db } from "../data/db"

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart') //obtener el carrito

        /*si hay algo en la variable lo convertimos en un array (está en String), 
        y en caso de que no haya nada : será un array vacío 
        Resumen: si tiene algo seteará ése valor sino su valor inciial será un array vacío */
        return localStorageCart ? JSON.parse(localStorageCart) : [] 

    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    const MAX_ITEMS = 5
    const MIN_ITEMS = 1
    useEffect(()=>{
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])





    function addToCart(item) {

        //verificamos si existe, de ésta forma evitaremos añadir múltiples veces un mismo item
        //si existe guardará su posición
        const itemExists = cart.findIndex((guitar)=>guitar.id == item.id)

        if(itemExists >= 0) {
            
            console.log('Ya existe, aumentando la cantidad del producto..')

            //evitar añadir más productos superior al límite desde el botón de abajo, de añadir
            //si la canidad es superior al limite, el return no hará nada, de lo contrario aumentará
            if(cart[itemExists].quantity >= MAX_ITEMS) return

            //copia de nuestro state, del carrito para poder modificarla. Y q el original es inmutable
            const updatedCart = [...cart] 

            //incremenetamos la cantidad del ítem de la posición X del carrito
            updatedCart[itemExists].quantity++

            //actualizamos nuestra copia del carrito
            setCart(updatedCart)

        }else{
            console.log('No existe, agregando producto..')
            item.quantity = 1
            setCart([...cart, item])
        }

    }



    /*Eliminar producto del carrito al presionar botón X
    en ésta función filtraremos las guitarras del array, cuyo id sea diferente a la que te esté pasando 
    y así filtraremos y sólo se mostrarán las guitars diferentes a la que hemos pasado,
    quitandola del carrito la del id que pasé,
    retornando el array sin la que indiqué*/
    function removeFromCart(id){
        console.log('Eliminando...', id)
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }



    function increaseQuantity(id){
        console.log('Incrementando', id)

        //creamos una nueva variable para modificar un arreglo (no modif sobre el state original)
        const updatedCart = cart.map ( item =>{
            if(item.id == id && item.quantity < MAX_ITEMS){ //indetificamos el id sobre el cual clicamos y limitamos la cantidad
                return{
                ...item,//lo que tenemos
                quantity : item.quantity +1 //incrementamos la cantidad
                }
            }
            return item //el resto los mantenemos intactos
        } )

        setCart(updatedCart)
    }



    function decreaseQuantity(id){
        console.log('Decrementando', id)

        const updatedCart = cart.map ( item =>{
            if(item.id == id && item.quantity > MIN_ITEMS ){ 
                return{
                ...item,
                quantity : item.quantity -1 
                }
            }
            return item 
        } )

        setCart(updatedCart)
    }



    function clearCart(e){
        setCart([])
    }    


     //State Derivado
     const isEmptyCarrito = useMemo( () => cart.length === 0, [cart] )
     const carTotal =  useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return{
        data, 
        cart, 
        addToCart, 
        removeFromCart, 
        increaseQuantity, 
        decreaseQuantity, 
        clearCart,
        isEmptyCarrito,
        carTotal
    }
}