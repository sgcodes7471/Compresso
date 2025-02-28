package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"strings"
)

type HuffmanNode struct {
	Char  rune
	Freq  int
	Left  *HuffmanNode
	Right *HuffmanNode
}

type HuffmanHeap []*HuffmanNode

func (h HuffmanHeap) Len() int           { return len(h) }
func (h HuffmanHeap) Less(i, j int) bool { return h[i].Freq < h[j].Freq }
func (h HuffmanHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *HuffmanHeap) Push(x interface{}) {
	*h = append(*h, x.(*HuffmanNode))
}
func (h *HuffmanHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func buildHuffmanTree(freqMap map[rune]int) *HuffmanNode {
	h := &HuffmanHeap{}
	for char, freq := range freqMap {
		node := &HuffmanNode{Char: char, Freq: freq}
		*h = append(*h, node)
	}
	sort.Sort(h)
	for len(*h) > 1 {
		left := (*h)[0]
		*h = (*h)[1:]
		right := (*h)[0]
		*h = (*h)[1:]
		node := &HuffmanNode{Freq: left.Freq + right.Freq, Left: left, Right: right}
		*h = append(*h, node)
		sort.Sort(h)
	}
	return (*h)[0]
}

func buildHuffmanCodes(node *HuffmanNode, code string, codes map[rune]string) {
	if node == nil {
		return
	}
	if node.Left == nil && node.Right == nil {
		codes[node.Char] = code
	}
	buildHuffmanCodes(node.Left, code+"0", codes)
	buildHuffmanCodes(node.Right, code+"1", codes)
}

func compressData(data string) string {
	freqMap := make(map[rune]int)
	for _, char := range data {
		freqMap[char]++
	}
	tree := buildHuffmanTree(freqMap)
	codes := make(map[rune]string)
	buildHuffmanCodes(tree, "", codes)

	var compressed strings.Builder
	for _, char := range data {
		compressed.WriteString(codes[char])
	}
	return compressed.String()
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	fileContent, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}

	compressedData := compressData(string(fileContent))
	compressedFilePath := "compressed_file.txt"
	os.WriteFile(compressedFilePath, []byte(compressedData), 0644)

	w.Header().Set("Content-Disposition", "attachment; filename="+compressedFilePath)
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(compressedData))
}

func main() {
	http.HandleFunc("/compress", uploadHandler)
	fmt.Println("Server started on :8080")
	http.ListenAndServe(":8080", nil)
}
