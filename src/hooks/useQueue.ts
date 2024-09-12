import { useEffect, useRef } from "react";

// Define a class for a linked list node
class ListNode<T> {
    value: T;
    next: ListNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

// Define a class for a queue
class Queue<T> {
    private head: ListNode<T> | null = null;
    private tail: ListNode<T> | null = null;
    private length: number = 0;

    // Add an element to the queue
    enqueue(value: T): void {
        const newNode = new ListNode(value);
        if (this.tail) {
            this.tail.next = newNode;
        }
        this.tail = newNode;
        if (!this.head) {
            this.head = newNode;
        }
        this.length++;
    }

    // Remove an element from the queue
    dequeue(): T | null {
        if (!this.head) {
            return null;
        }
        const dequeuedValue = this.head.value;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null;
        }
        this.length--;
        return dequeuedValue;
    }

    // Get the first element in the queue
    getFirst(): T | null {
        return this.head ? this.head.value : null;
    }

    // Get the last element in the queue
    getLast(): T | null {
        return this.tail ? this.tail.value : null;
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.length === 0;
    }

    // Get the size of the queue
    size(): number {
        return this.length;
    }

    // Get all elements in the queue
    getAllItems(): T[] {
        const items: T[] = [];
        let currentNode = this.head;

        while (currentNode) {
            items.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return items;
    }

    // Clear the queue
    clear(): void {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}

// Custom hook for using a queue
function useQueue<T>(initialValues?: T[]) {
    // Create a ref for the queue
    const queueRef = useRef(new Queue<T>());

    // Initialize the queue with initial values on mount
    useEffect(() => {
        if (initialValues) {
            initialValues.forEach(value => queueRef.current.enqueue(value));
        }

        // Clear the queue on unmount
        return () => {
            queueRef.current.clear();
        };
    }, []);

    // Add an element to the queue
    const add = (value: T) => {
        queueRef.current.enqueue(value);
    };

    // Remove an element from the queue
    const remove = (): T | null => {
        return queueRef.current.dequeue();
    };

    // Get the first element in the queue
    const getFirst = (): T | null => {
        return queueRef.current.getFirst();
    };

    // Get the last element in the queue
    const getLast = (): T | null => {
        return queueRef.current.getLast();
    };

    // Check if the queue is empty
    const isEmpty = (): boolean => {
        return queueRef.current.isEmpty();
    };

    // Get the size of the queue
    const size = (): number => {
        return queueRef.current.size();
    };

    // Get all elements in the queue
    const getAllItems = (): T[] => {
        return queueRef.current.getAllItems();
    };

    // Clear the queue
    const clear = (): void => {
        queueRef.current.clear();
    };

    // Return the queue functions
    return { add, remove, getFirst, getLast, isEmpty, size, getAllItems, clear };
}

export default useQueue;