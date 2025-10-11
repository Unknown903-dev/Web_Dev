import json
import time
# 1 2 3 4
# 10

# 1-------------------------------------------------------------

def adding_program():
    #grab input
    while(True):
        nums = str(input("enter two or more numbers to add\n"))
        match = True
    
        nums = nums + " "
        digits = ""
        num_list = []

        #loop through the amount of chars in nums
        for i in nums:
            # trys to see if the number is a number if not print error
            if i ==  " ":
                try:
                    #if it is a number it goes to the list
                    num_list.append(float(digits))
                    digits = ""
                #if not number error prints 
                except:
                    print("type a number no letters\n")
                    match = False
            # it grabs one number from the string
            else:
                digits = digits + i
        if match:
            break
            
    add = 0
    #adds all the numbers in the list
    for i in num_list:
        add = add + i
    # if list is small prints statement
    if len(num_list) + 1 < 2:
        print("need more numbers")
    else:
        print(add)



# 2-----------------------------------------------------------
def punish():
    #grab input check for error 

    while(True):
        b=True
        sentence = input("write a sentence")
        try:
            repeat = int(input("how many times should the sentence be repeated\n"))
        except:
            print("Choose the number for the amount of times the sentence should be repeated")
            b = False
        if b == True:
            break

    #loops through specified amout of repeats
    for i in range(repeat):
        #opens a file and writes/appends the sentence 
        with open("CompletedPunishment.txt", "a") as f:
            f.write(sentence + "\n")


            
# 3------------------------------------------------------------
def count_word():
    #checks if input is a number
    #grab the input and turn into uppercase
    while(True):
        word = input("what word do you want to find\n").upper()
        if word.isdigit():
            print("type a word not a number")
        else:
            break
        
        
    total = 0 

    #reads the file 
    with open("PythonSummary.txt", "r") as file:
        for line in file:
            #loops through each line and make it uppercase
            sentence = line.strip().upper()
            count = 0
            
            #loops through each char in sentence
            for i in range(len(sentence)):
                match = True
                #loops through each char in word specified
                for j in range(len(word)):
                    # checks if the letter doesnt match
                    try:
                        if sentence[i+j] != word[j]:
                            match = False
                            break
                    except:
                        continue
                    
                #if it does match increment
                if match:
                    count += 1
            total = count + total
    print("the word occurs", total, "times")


#4-------------------------------------------------------------
class NameClass:
    #assigns the data
    def __init__(self, amount="", depart="", dep_num="", name="", units="", day="", start_time="", end_time="", avg_grade=""):
        self.amount=amount
        self.name = name
        self.depart = depart
        self.dep_num = dep_num
        self.units = units
        self.day = day
        self.start_time = start_time
        self.end_time = end_time
        self.avg_grade = avg_grade

    #read file and get the first 8 lines
    def read(self, i):
        with open("classesInput.txt", "r") as file:

            #takes out whitespaces
            lines = []
            for j in file:
                lines.append(j.strip())

            #increment by the specified i
            # and assigns the variable by the line on the file
            self.amount = int(lines[0])
            self.depart = lines[1+i]
            self.dep_num = lines[2+i]
            self.name = lines[3+i]
            self.units = lines[4+i]
            self.day = lines[5+i]
            self.start_time =lines[6+i]
            self.end_time = lines[7+i]
            self.avg_grade = lines[8+i]

    # write the format
    def format(self):
        #calls the read function
        self.read(0)
        total = self.amount
        i=0

        #loops by the amount of courses chosen 
        for k in range(total):
            # calls the read function each time but increments i by 8 each loop
            self.read(i)

            with open("ClassesOutput.txt", "a") as file:
                file.write("COURSE %s: %s%s: %s\n" %(k+1, self.depart, self.dep_num, self.name))
                file.write("Number of Credits: %s\n" %(self.units))
                file.write("Days of Lectures: %s\n" %(self.day))
                file.write("Lecture Time: %s - %s\n" %(self.start_time, self.end_time))
                file.write("Stat: on average, students get %s in this course\n" %(self.avg_grade + "%"))
                file.write("\n")
            i+=8
            
            
        with open('ClassesOutput.txt', 'r') as file: 
            # Iterate through each line
            for line in file:
                # Now current_string holds the string from that lin
                current_string = line.strip()
                text = current_string
                print(text)


                
#5----------------------------------------------------------------------------------------


#start menu
def menu():
    print("---------------\nType the number\n---------------\n")
    print("1:  create student name & grade\n")
    print("2:  check a students grade\n") 
    print("3:  edit a students grade\n") 
    print("4:  delete a students name / grade\n")
    print("5: save and print the data\n\n")
    print("6: EXIT THE PROGRAM")

def grades():
    #turn json file to python dictionary
    with open ("grades.txt") as json_file:
        data = json.load(json_file)
        while (True):
            menu()
            #checks if user input is a number if not 
            #assign the input to be 7 to print error
            try:
                user = int(input())
            except:
                user = 7
            # add a new name and grade
            if user == 1:
                while True:
                    new_name = input("type the name you would like to add or press 6 to exit\n")
                    if new_name == '6':
                        break
                    try:
                        new_grade = float(input("what grade do they have\n"))
                        data[new_name] = new_grade
                    except:
                        print("the input for grade was not a number start over")
                    
                    

            # check the grade of a student
            elif user == 2:
                while True:
                    name = input("Type the full name to see the grade or type 6 to exit\n")
                    if name == '6':
                        break
                    elif name not in data:
                        print("name does not exist heres the current list")
                        print(data)
                    else:
                        print(data[name])
                        time.sleep(2)
                        break


            # edit a students grade
            elif user == 3:
                while True:
                    try:
                        edit_name = input("type the name u want to edit\n")
                        final_grade = float(input("type the grade or press 6 to exit\n"))
                        if edit_name == '6' or final_grade == 6:
                            break
                        elif edit_name not in data:
                            print("the name does not exist heres the current list")
                            print(data)
                        else:
                            edit_grade = {edit_name:final_grade}
                            data.update(edit_grade)
                            break
                    except:
                        print("the input for grade was not a number start over")
            
            # delete a student
            
            elif user == 4:
                while True:
                    try:
                        delete_name = input("\nwhat name do you want to delete or press 6 to exit")
                        if delete_name == '6':
                            break
                        action = data.pop(delete_name)
                        break
                    except:
                        print("make sure you have the correct name heres the current sudents (dont forget to check capitalization)\n")
                        print(data)
                

            # save the changes and print
            elif user == 5:
                with open ("grades.txt", "w") as file:
                    json.dump(data, file)
                file.close()
                print(data)
                time.sleep(2)


            # exit program
            elif user == 6:
                break
            #error message for start menu
            else:
                print("Type a number 1 through 6")
                time.sleep(1)

#5
#grades()


#4
#namer1 = NameClass()
#namer1.format()

#3
count_word()

#2
#punish()

#1
#adding_program()